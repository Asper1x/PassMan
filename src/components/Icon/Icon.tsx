import { LucideProps, icons } from 'lucide-react';

export type IconNames = keyof typeof icons;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof icons;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];

  return <LucideIcon {...props} />;
};

export default Icon;  