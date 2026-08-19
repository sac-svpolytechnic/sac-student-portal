import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SAC — Sign In',
  description: 'Sign in to the Student Activity Centre portal',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background mesh */}
      <div className="bg-mesh" />

      {/* Content */}
      <div style={{ width: '100%', maxWidth: '26rem', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
