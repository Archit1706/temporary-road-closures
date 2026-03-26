import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LoginProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LoginFormData {
    username: string;
    password: string;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
    const { login, state } = useClosures();
    const { loading } = state;
    const [showDemoCredentials, setShowDemoCredentials] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.username, data.password);
            reset();
            onClose();
        } catch (error) {
            // Error handling is done in the context via hot-toast/sonner
        }
    };

    const handleDemoLogin = () => {
        setValue('username', 'chicago_mapper');
        setValue('password', 'SecurePass123');
        setShowDemoCredentials(true);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <LogIn className="w-5 h-5 text-blue-600" />
                        <span>Login</span>
                    </DialogTitle>
                    <DialogDescription>
                        Access the backend API
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Username */}
                    <div className="space-y-2">
                        <Label htmlFor="username" className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Username</span>
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            {...register('username', {
                                required: 'Username is required',
                                minLength: { value: 3, message: 'Username must be at least 3 characters' }
                            })}
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p className="text-sm text-red-600 font-medium">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Password</span>
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Demo Credentials */}
                    <Alert className="bg-blue-50/50 text-blue-800 border-blue-200">
                        <AlertCircle className="w-4 h-4 !text-blue-600" />
                        <AlertTitle>Demo Account Available</AlertTitle>
                        <AlertDescription className="mt-2 text-blue-700/90">
                            Use the demo credentials to test the backend integration.
                            {showDemoCredentials && (
                                <div className="bg-blue-100/50 rounded flex flex-col p-2 my-2 font-mono text-xs text-blue-900 border border-blue-200/50">
                                    <span>Username: chicago_mapper</span>
                                    <span>Password: SecurePass123</span>
                                </div>
                            )}
                            <Button
                                type="button"
                                variant="link"
                                onClick={handleDemoLogin}
                                className="h-auto p-0 text-blue-600 hover:text-blue-800"
                            >
                                Fill Demo Credentials
                            </Button>
                        </AlertDescription>
                    </Alert>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Login;