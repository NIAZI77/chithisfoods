export const getVendors = async () => {
  let response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?populate=*`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
    }
  });
  let data = await response.json();
  return data;
}