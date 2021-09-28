declare interface ITabItem {
  label: string;
  index: number;
  display: boolean;
  Component: React.LazyExoticComponent<() => JSX.Element>;
}
