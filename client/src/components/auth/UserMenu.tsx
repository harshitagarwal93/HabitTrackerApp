import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserMenuProps {
  userName: string | null;
}

export function UserMenu({ userName }: UserMenuProps) {
  if (!userName) {
    return (
      <Button variant="outline" size="sm" asChild>
        <a href="/.auth/login/github">Sign in</a>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <span className="hidden md:inline text-foreground/80">{userName}</span>
      </div>
      <Button variant="ghost" size="icon" className="w-8 h-8" asChild title="Sign out">
        <a href="/.auth/logout">
          <LogOut className="w-4 h-4" />
        </a>
      </Button>
    </div>
  );
}
