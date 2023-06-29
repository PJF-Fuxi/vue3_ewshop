import { request } from "./request";

export function getDetailData(id: number) {
  return request({
    url: "/api/goods/" + id,
  });
}
