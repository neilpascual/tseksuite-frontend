import { useAuth } from '../../hooks/useAuth'

function DashboardPage() {
  const { data: user, isLoading, isError } = useAuth();

  if (isLoading) return <div>Loading user...</div>;
  if (isError || !user) return <div>Failed to load user</div>;

  console.log("User data:", user);

  return (
    <div className="flex justify-center items-center text-black">
      Welcome {user.name}
    </div>
  );
}

export default DashboardPage;
