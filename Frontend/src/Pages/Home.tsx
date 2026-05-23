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
  const createpost = () => {
    navigate("/create-post");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-muted/40 flex justify-center">
      
      <div className="w-full max-w-3xl px-4 py-6">

        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">

       
          <Input
            placeholder="Search posts..."
            className="w-full sm:flex-1"
          />

          <Button className="flex items-center gap-2 w-full sm:w-auto justify-center" onClick={createpost}>
            <Plus size={18} />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </div>

      
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