### Here's a recap of the scenarios and behaviors of this login form:

#### Initial Login View:
- **Displays:**
  - Email and password fields
  - A "Forgot your password?" link
  - A Sign up link
  - A login button

#### Invalid Credentials:
- **When email/password combination is incorrect:**
  - **Displays an error message:** "The email or password you entered is incorrect"
  - **Action:** Keeps the user on the login view

#### Unverified Account:
- **When the email is not yet verified:**
  - **Shows an alert message** telling the user about the unverified email
  - **Provides:** A "Resend Verification Email" button

#### Two-Factor Authentication (2FA) Setup Required: (always required after registration)
 **This scenario depends on whether the user has 2FA enabled or needs to set it up:**
  - **For users needing to set up 2FA:**
    - **Displays:** A QR code for scanning with an authenticator app
  - **Successful TOTP Setup:**
    - **After entering a valid 6-digit code in the TOTP setup:**
      - **Generates and displays:** 10 backup codes
      - **Offers options:** To copy backup codes and return to login

#### Two-Factor Authentication (2FA) Verification:
- **For users who already have 2FA set up:**
  - **Shows:** The TOTP verification view
  - **Provides:** An input for the 6-digit TOTP code

#### Successful 2FA Verification:
- **Action:** Takes the user to the dashboard


### Notes: 

#### All buttons must use Loader2 Componet from shadcn/ui when making any post/get to api.

```node
import { Loader2 } from "lucide-react"
 
import { Button } from "@/components/ui/button"
 
export function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2 className="animate-spin" />
      Please wait
    </Button>
  )
}
```

#### Error Handling:
-	Displays form validation errors for email and password fields

-	Toast Notifications:
    -	Displays a success toast when backup codes are successfully copied


