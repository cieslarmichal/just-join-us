import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb';

interface Props {
  previousItems: {
    label: string;
    href: string;
  }[];
  currentItem: {
    label: string;
  };
}

export function Breadcrumbs({ previousItems, currentItem }: Props) {
  return (
    <Breadcrumb className="mb-2 mt-2">
      <BreadcrumbList>
        {previousItems.map((item, index) => (
          <>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentItem.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
