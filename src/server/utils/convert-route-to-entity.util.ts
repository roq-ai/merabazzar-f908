const mapping: Record<string, string> = {
  organizations: 'organization',
  products: 'product',
  users: 'user',
  'vendor-profiles': 'vendor_profile',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
