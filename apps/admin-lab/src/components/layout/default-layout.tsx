import Sidebar from './sidebar';

interface Props {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: Props) => {
  return (
    <div className="relative">
      <Sidebar />
      {children}
    </div>
  );
};

export default DefaultLayout;
