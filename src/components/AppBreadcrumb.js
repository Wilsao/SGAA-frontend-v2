import React from 'react';
import { useLocation } from 'react-router-dom';
import routes from '../routes';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname;

  const getRouteName = (pathname, routes) => {
    for (const route of routes) {
      if (route.path === pathname) {
        return route.name;
      }
      if (route.children) {
        const matchingChildRoute = route.children.find((child) => child.path === pathname);
        if (matchingChildRoute) {
          return matchingChildRoute.name;
        }
      }
    }
    return false;
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    const paths = location.split('/').filter((path) => path);

    paths.reduce((prev, curr, index) => {
      const currentPathname = `${prev}/${curr}`;
      const routeName = getRouteName(currentPathname.replace('/admin', ''), routes);

      if (routeName) {
        breadcrumbs.push({
          pathname: `#${currentPathname}`,
          name: routeName,
          active: index + 1 === paths.length ? true : false,
        });
      }

      return currentPathname;
    }, '');
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="#/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
          key={index}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
