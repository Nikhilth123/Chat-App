import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/hooks/reduxhooks';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Postcard } from '@/components/Postcard';
import { useEffect } from 'react';

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-muted/40 flex justify-center">
      
      {/* Main Container */}
      <div className="w-full max-w-3xl px-4 py-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">

          {/* Search */}
          <Input
            placeholder="Search posts..."
            className="w-full sm:flex-1"
          />

          {/* Add Button */}
          <Button className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus size={18} />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-4">
          <Postcard />
          <Postcard />
          <Postcard />
          <Postcard />
          <Postcard />
          <Postcard />
          <Postcard />
        </div>

      </div>
    </div>
  );
};

export default Home;