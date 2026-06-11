"""
Tests for GitHub issue #30: bounding box longitude normalisation.

Leaflet may produce longitude values outside [-180, 180] when the user pans
past the antimeridian.  worldCopyJump=true (PR #31) reduces this but does not
eliminate it near the date line.  _parse_bbox normalises out-of-range
longitudes and splits antimeridian-crossing bboxes into two sub-bboxes.
"""

import pytest

from app.core.exceptions import ValidationException
from app.services.closure_service import ClosureService


class TestNormaliseLongitude:
    """Unit tests for _normalise_longitude helper."""

    def _svc(self):
        return ClosureService.__new__(ClosureService)

    def test_normal_longitude_unchanged(self):
        svc = self._svc()
        assert svc._normalise_longitude(0.0) == pytest.approx(0.0)
        assert svc._normalise_longitude(10.5) == pytest.approx(10.5)
        assert svc._normalise_longitude(-10.5) == pytest.approx(-10.5)
        assert svc._normalise_longitude(180.0) == pytest.approx(-180.0)
        assert svc._normalise_longitude(-180.0) == pytest.approx(-180.0)

    def test_longitude_above_180_wraps(self):
        svc = self._svc()
        assert svc._normalise_longitude(181.0) == pytest.approx(-179.0)
        assert svc._normalise_longitude(190.0) == pytest.approx(-170.0)
        assert svc._normalise_longitude(360.0) == pytest.approx(0.0)
        assert svc._normalise_longitude(540.0) == pytest.approx(-180.0)

    def test_longitude_below_minus_180_wraps(self):
        svc = self._svc()
        assert svc._normalise_longitude(-181.0) == pytest.approx(179.0)
        assert svc._normalise_longitude(-270.0) == pytest.approx(90.0)


class TestParseBbox:
    """Tests for _parse_bbox, including world-wrap edge cases."""

    def _svc(self):
        return ClosureService.__new__(ClosureService)

    def _parse(self, bbox_str):
        from unittest.mock import patch

        svc = self._svc()
        with patch("app.services.closure_service.settings") as mock_settings:
            mock_settings.MAX_BBOX_AREA = 25.0
            return svc._parse_bbox(bbox_str)

    # ── Normal cases ──────────────────────────────────────────────────────────

    def test_valid_bbox_returns_single_entry(self):
        bboxes = self._parse("-87.7,41.8,-87.6,41.9")
        assert len(bboxes) == 1
        min_lon, min_lat, max_lon, max_lat = bboxes[0]
        assert min_lon == pytest.approx(-87.7)
        assert min_lat == pytest.approx(41.8)
        assert max_lon == pytest.approx(-87.6)
        assert max_lat == pytest.approx(41.9)

    def test_coords_rounded_to_5dp(self):
        bboxes = self._parse("-87.123456789,41.8,-87.0,41.9")
        assert len(bboxes) == 1
        assert bboxes[0][0] == pytest.approx(-87.12346, abs=1e-5)

    # ── World-wrap cases (issue #30) ──────────────────────────────────────────

    def test_max_lon_above_180_normalised_no_crossing(self):
        """Leaflet panned east: max_lon > 180 but still west of antimeridian."""
        # 350 normalises to -10; min_lon=10 < max_lon=-10 is False, so no split
        # Actually 10,50,190,60: 190 → -170; 10 > -170 → split case
        # Use a case that doesn't cross: 0,50,179,60 (valid), or 350→-10,50,360→0,60
        bboxes = self._parse("350.0,51.0,360.0,52.0")
        # 350→-10, 360→0; -10 < 0, so single bbox
        assert len(bboxes) == 1
        min_lon, _, max_lon, _ = bboxes[0]
        assert -180.0 <= min_lon <= 180.0
        assert -180.0 <= max_lon <= 180.0
        assert min_lon < max_lon

    def test_antimeridian_crossing_splits_into_two_bboxes(self):
        """
        A bbox crossing the antimeridian is split into two halves.
        170,50,200,60: 200 normalises to -160; 170 > -160 → split.
        """
        bboxes = self._parse("170.0,50.0,200.0,60.0")
        assert len(bboxes) == 2

        east, west = bboxes
        # Eastern piece: from original min_lon to +180
        assert east[0] == pytest.approx(170.0)
        assert east[2] == pytest.approx(180.0)
        # Western piece: from -180 to normalised max_lon
        assert west[0] == pytest.approx(-180.0)
        assert west[2] == pytest.approx(-160.0)
        # Both pieces share the same latitude band
        for b in bboxes:
            assert b[1] == pytest.approx(50.0)
            assert b[3] == pytest.approx(60.0)

    def test_antimeridian_split_pieces_are_valid_envelopes(self):
        """Each split piece must have min_lon < max_lon."""
        bboxes = self._parse("170.0,50.0,200.0,60.0")
        for b in bboxes:
            assert b[0] < b[2], f"Invalid envelope: {b}"

    # ── Error cases ───────────────────────────────────────────────────────────

    def test_invalid_format_raises(self):
        with pytest.raises(ValidationException):
            self._parse("not,a,bbox")

    def test_wrong_number_of_coords_raises(self):
        with pytest.raises(ValidationException):
            self._parse("1.0,2.0,3.0")

    def test_invalid_latitude_raises(self):
        with pytest.raises(ValidationException):
            self._parse("0.0,91.0,1.0,92.0")

    def test_min_lat_ge_max_lat_raises(self):
        with pytest.raises(ValidationException):
            self._parse("0.0,51.0,1.0,50.0")
