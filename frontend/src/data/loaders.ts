import qs from "qs";
import { getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "./services/get-token";

async function fetchData(url: string) {
  const authToken = await getAuthToken();
  console.log("authToken value:", authToken);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };

  try {
    const response = await fetch(url, { method: "GET", headers });
    const text = await response.text();
    console.log("response url:", url);
    console.log("response text:", text.slice(0, 200));
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getHomePageData() {
  const baseUrl = getStrapiURL();
  const url = new URL("/api/home-page", baseUrl);
  url.search = qs.stringify({
    populate: {
      blocks: {
        on: {
          "layout.hero-section": {
            populate: {
              image: { fields: ["url", "alternativeText"] },
              link: { populate: true },
            },
          },
          "layout.features-section": {
            populate: { feature: { populate: true } },
          },
        },
      },
    },
  });
  return await fetchData(url.href);
}

export async function getGlobalData() {
  const baseUrl = getStrapiURL();
  const url = new URL("/api/global", baseUrl);
  url.search = qs.stringify({
    populate: [
      "header.logoText",
      "header.ctaButton",
      "footer.logoText",
      "footer.socialLink",
    ],
  });
  return await fetchData(url.href);
}

export async function getGlobalPageMetadata() {
  const baseUrl = getStrapiURL();
  const url = new URL("/api/global", baseUrl);
  url.search = qs.stringify({
    fields: ["title", "description"],
  });
  return await fetchData(url.href);
}

export async function getSummaries(queryString: string, currentPage: number) {
  const baseUrl = getStrapiURL();
  const PAGE_SIZE = 4;
  const query = qs.stringify({
    sort: ["createdAt:desc"],
    filters: {
      $or: [
        { title: { $containsi: queryString } },
        { summary: { $containsi: queryString } },
      ],
    },
    pagination: { pageSize: PAGE_SIZE, page: currentPage },
  });
  const url = new URL("/api/summaries", baseUrl);
  url.search = query;
  return fetchData(url.href);
}

export async function getSummaryById(summaryId: string) {
  const baseUrl = getStrapiURL();
  return fetchData(`${baseUrl}/api/summaries/${summaryId}`);
}
