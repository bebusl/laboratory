interface Props {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: Props) => {
  return <div className="relative">{children}</div>;
};

export default DefaultLayout;
