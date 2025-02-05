import { createCookie, removeCookie } from "@/lib/cookieManagment";
import { create } from "zustand";

// export const AUTH_STEPS = {
//     REGISTRATION:'STEP_REGISTRATION',
//     MANUALLY_EMAIL_VERIFICATION: 'STEP_MANUALLY_EMAIL_VERIFICATION',
//     REGISTRATION_EMAIL_LINK_VERIFICATION: 'STEP_EMAIL_LINK_VERIFICATION',
//     LOGIN: 'STEP_LOGIN',
//     LOGIN_GENERATE_2FA_SECRET: 'STEP_LOGIN_GENERATE_2FA_SECRET',
//     ENABLE_2FA: 'STEP_ENABLE_2FA',
//     BACKUP_CODE: 'STEP_BACKUP_CODE',
//     FORGOT_PASSWORD: 'STEP_FORGOT_PASSWORD',
//     RESET_PASSWORD: 'STEP_RESET_PASSWORD',
//     COMPLETE: 'STEP_COMPLETE',
//   };

interface AuthState {
  completedSteps: Set<string>; // Tracks completed steps
  completeStep: (step: string) => void; // Mark a step as completed
  isAllowed: (requiredSteps: string[]) => boolean; // Check access based on dependencies
}

export const useAuthStore = create<AuthState>((set, get) => ({
  completedSteps: new Set(),

  completeStep: (step) =>
    set((state) => ({
      completedSteps: new Set(state.completedSteps).add(step),
    })),

  isAllowed: (requiredSteps) => {
    const completedSteps = get().completedSteps;
    return requiredSteps.every((step) => completedSteps.has(step));
  },
}));

type Store = {
  AccountId: string | null;
  UserId: string | null;
  FirstName: string;
  LastName: string;
  OrganizationName: string | null;
  Provider: string | null;
  setAccountId: (id: string) => void;
  setUserId: (id: string, firstname: string, lastname: string) => void;
  setOrganizationName: (name: string) => void;
  setProvider: (provider: string) => void;
};

export const useOrganizationStore = create<Store>((set) => ({
  AccountId: null,
  UserId: null,
  FirstName: "",
  LastName: "",
  OrganizationName: null,
  Provider: null,
  setAccountId: async (id) => {
    removeCookie("AccountID");
    createCookie("AccountID", id, 1);
    set({ AccountId: id });
  },
  setUserId: (id, firstname, lastname) => {
    set({ UserId: id, FirstName: firstname, LastName: lastname });
    createCookie("UserId", id, 1);
  },
  setOrganizationName: async (name) => {
    removeCookie("Organization");
    createCookie("Organization", name, 1);
    set({ OrganizationName: name });
  },
  setProvider: async (provider) => {
    set({ Provider: provider });
  },
}));
