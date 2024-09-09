import React from 'react';
import { useLocation } from 'react-router-dom';

import routes from '../routes';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';

const AppBreadcrumb = () => {
  // Obtendo a localização atual, removendo o hash '#' da URL
  const currentLocation = useLocation().pathname;

  // Função para obter o nome da rota com base no caminho
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname);
    return currentRoute ? currentRoute.name : false;
  };

  // Função para gerar as breadcrumbs
  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    const paths = location.split('/').filter((path) => path); // Remove elementos vazios causados por '/'

    paths.reduce((prev, curr, index) => {
      const currentPathname = `${prev}/${curr}`;
      const routeName = getRouteName(currentPathname.replace('/admin', ''), routes);
      // console.log(currentPathname.replace('/admin/', ''))
      if (routeName) {
        breadcrumbs.push({
          pathname: `#${currentPathname}`, // Adiciona o hash para o roteamento correto
          name: routeName,
          active: index + 1 === paths.length ? true : false,
        });
      }

      return currentPathname;
    }, '');
    return breadcrumbs;
  };

  // Gerando os breadcrumbs com base na localização atual
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
