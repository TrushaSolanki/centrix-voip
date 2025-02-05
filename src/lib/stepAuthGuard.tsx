import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';

// Inner pages requied steps need to be done before the user access
export const AUTH_PAGE_DEPENDENCIES: Record<string, string[]> = {
  "/two-factor-login":['STEP_LOGIN'] ,  // login after 2fa page requires login
  "/email-verification":['STEP_REGISTRATION'], 
  "/backup-codes":['STEP_LOGIN','STEP_LOGIN_GENERATE_2FA_SECRET'], // Dashboard requires login and 2fs enable steps done
  "/manually-email-verification":['STEP_REGISTRATION'],
  "/password-reset":['STEP_FORGOT_PASSWORD'],
  "/two-factor-authentication":['STEP_LOGIN'] ,//generate 2fa secret need login done before access
  };

const withStepGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>, 
  requiredStep?: string
) => {
  const StepGuard: React.FC<P> = (props) => {
    const [isMounted, setIsMounted] = useState(false); // State to track if component is mounted on the client-side
    const router = useRouter();
    const pathname = usePathname();
 const isAllowed = useAuthStore((state) => state.isAllowed);

    useEffect(() => {
      setIsMounted(true); // Set to true when the component mounts on the client-side
    }, []);

    useEffect(() => {
      // Only run this code if the component is mounted (client-side)
      if (!isMounted) return;

      const dependencies = requiredStep
        ? [requiredStep]
        : AUTH_PAGE_DEPENDENCIES[pathname] || [];

      if (!isAllowed(dependencies)) {
        // Redirect to login if dependencies are not met
        router.push('/login');
      }
    }, [isAllowed, router, isMounted, requiredStep]);

    if (!isMounted) {
      return null; // Prevent rendering while the component is mounting (avoid SSR issues)
    }

    return <WrappedComponent {...props} />;
  };

  return StepGuard;
};

export default withStepGuard;
