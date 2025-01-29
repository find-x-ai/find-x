import { MetadataRoute } from "next";
import { blogPosts } from "./(home)/blogs/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.find-x.tech";
  const blogs = blogPosts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.date),
  }));
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/dashboard/indexing`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/dashboard/analytics`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/dashboard/settings`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/dashboard/billing`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs/getting_started`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs/installation`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs/setup`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs/custom`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
    },
    ...blogs,
    {
      url: `${baseUrl}/policy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
    },
  ];
}
