import Mustache from "mustache";

export function stringFormatter(templateString: string, params: object): string {
  return Mustache.render(templateString, params);
}
