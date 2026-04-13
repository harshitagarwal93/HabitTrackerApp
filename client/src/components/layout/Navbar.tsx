import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from '@/components/auth/UserMenu';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  userName: string | null;
}

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/plan', label: 'All' },
  { to: '/plan/azure', label: 'Azure' },
  { to: '/plan/cp', label: 'CP' },
];

export function Navbar({ isDark, onToggleTheme, userName }: NavbarProps) {
  const location = useLocation();

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="font-bold text-lg">PrepTracker</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-md transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          <UserMenu userName={userName} />
        </div>
      </div>
    </header>
  );
}
