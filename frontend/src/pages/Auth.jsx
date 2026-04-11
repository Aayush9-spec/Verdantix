import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Auth = ({ mode = 'signIn' }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="relative z-10"
      >
        {mode === 'signIn' ? (
          <SignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                card: "glass border border-white/10 shadow-2xl",
                headerTitle: "text-white text-2xl font-black",
                headerSubtitle: "text-gray-400",
                formButtonPrimary: "bg-primary hover:bg-emerald-600 border-none",
                socialButtonsBlockButton: "glass border border-white/5 text-white hover:bg-white/5",
                socialButtonsBlockButtonText: "text-white",
                formFieldLabel: "text-gray-300",
                formFieldInput: "glass border border-white/10 text-white",
                footerActionText: "text-gray-400",
                footerActionLink: "text-primary hover:text-emerald-400"
              }
            }}
          />
        ) : (
          <SignUp 
            routing="path" 
            path="/sign-up" 
            signInUrl="/sign-in"
            appearance={{
              elements: {
                card: "glass border border-white/10 shadow-2xl",
                headerTitle: "text-white text-2xl font-black",
                headerSubtitle: "text-gray-400",
                formButtonPrimary: "bg-primary hover:bg-emerald-600 border-none",
                socialButtonsBlockButton: "glass border border-white/5 text-white hover:bg-white/5",
                socialButtonsBlockButtonText: "text-white",
                formFieldLabel: "text-gray-300",
                formFieldInput: "glass border border-white/10 text-white",
                footerActionText: "text-gray-400",
                footerActionLink: "text-primary hover:text-emerald-400"
              }
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
