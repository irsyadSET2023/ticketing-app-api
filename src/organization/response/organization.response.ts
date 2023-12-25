export const OrganizationResponse = (organization: any) => {
  delete organization.api_key;
  return {
    ...organization,
  };
};
