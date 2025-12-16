import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useVideos(category?: string, search?: string, sort?: string) {
  const params = new URLSearchParams()
  if (category) params.append("category", category)
  if (search) params.append("search", search)
  if (sort) params.append("sort", sort)

  const { data, error, isLoading } = useSWR(`/api/videos?${params.toString()}`, fetcher)

  return {
    videos: data?.data || [],
    isLoading,
    error,
  }
}

export function useVideo(id: string) {
  const { data, error, isLoading } = useSWR(`/api/videos/${id}`, fetcher)

  return {
    video: data?.data,
    isLoading,
    error,
  }
}
