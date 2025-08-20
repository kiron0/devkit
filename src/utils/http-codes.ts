import { AlertTriangle, CheckCircle, Clock, Info, XCircle } from "lucide-react"

interface HTTPStatus {
  code: number
  name: string
  description: string
  category:
    | "informational"
    | "success"
    | "redirection"
    | "client-error"
    | "server-error"
  commonUseCases: string[]
  troubleshooting: string[]
  rfc: string
}

export const HTTP_STATUSES: HTTPStatus[] = [
  // 1xx Informational
  {
    code: 100,
    name: "Continue",
    description:
      "The server has received the request headers and the client should proceed to send the request body.",
    category: "informational",
    commonUseCases: [
      "Large file uploads",
      "HTTP/1.1 protocol",
      "Expect header handling",
    ],
    troubleshooting: [
      "Check if client is sending Expect: 100-continue header",
      "Verify server supports HTTP/1.1",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 101,
    name: "Switching Protocols",
    description:
      "The server is switching protocols as requested by the client.",
    category: "informational",
    commonUseCases: [
      "WebSocket upgrades",
      "HTTP/2 upgrades",
      "Protocol switching",
    ],
    troubleshooting: [
      "Ensure client supports the target protocol",
      "Check upgrade header",
    ],
    rfc: "RFC 7231",
  },

  // 2xx Success
  {
    code: 200,
    name: "OK",
    description:
      "The request has succeeded. The information returned with the response is dependent on the method used in the request.",
    category: "success",
    commonUseCases: [
      "Successful GET requests",
      "API responses",
      "File downloads",
    ],
    troubleshooting: ["Standard success response", "No action needed"],
    rfc: "RFC 7231",
  },
  {
    code: 201,
    name: "Created",
    description:
      "The request has succeeded and a new resource has been created as a result.",
    category: "success",
    commonUseCases: ["Resource creation", "POST requests", "File uploads"],
    troubleshooting: [
      "Check if resource was actually created",
      "Verify location header",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 204,
    name: "No Content",
    description:
      "The server successfully processed the request and is not returning any content.",
    category: "success",
    commonUseCases: [
      "DELETE operations",
      "Updates without response body",
      "Form submissions",
    ],
    troubleshooting: [
      "Response body should be empty",
      "Check for unexpected content",
    ],
    rfc: "RFC 7231",
  },

  // 3xx Redirection
  {
    code: 301,
    name: "Moved Permanently",
    description:
      "The requested resource has been permanently moved to the URL given by the Location headers.",
    category: "redirection",
    commonUseCases: ["URL redirects", "SEO redirects", "Domain changes"],
    troubleshooting: [
      "Check Location header",
      "Update bookmarks and links",
      "Consider 308 for POST requests",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 302,
    name: "Found",
    description:
      "The requested resource has been temporarily moved to the URL given by the Location headers.",
    category: "redirection",
    commonUseCases: [
      "Temporary redirects",
      "Login redirects",
      "Form submissions",
    ],
    troubleshooting: [
      "Check Location header",
      "Verify redirect destination",
      "Consider 307 for POST requests",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 304,
    name: "Not Modified",
    description:
      "The client can use cached data. The response must not contain a message body.",
    category: "redirection",
    commonUseCases: ["Caching", "Conditional requests", "ETag validation"],
    troubleshooting: [
      "Check If-None-Match header",
      "Verify cache headers",
      "Ensure no response body",
    ],
    rfc: "RFC 7232",
  },

  // 4xx Client Errors
  {
    code: 400,
    name: "Bad Request",
    description:
      "The server cannot or will not process the request due to an apparent client error.",
    category: "client-error",
    commonUseCases: [
      "Invalid syntax",
      "Malformed requests",
      "Missing parameters",
    ],
    troubleshooting: [
      "Check request syntax",
      "Verify required parameters",
      "Review request headers",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 401,
    name: "Unauthorized",
    description:
      "Authentication is required and has failed or has not been provided.",
    category: "client-error",
    commonUseCases: [
      "Login required",
      "Invalid credentials",
      "Missing authentication",
    ],
    troubleshooting: [
      "Check Authorization header",
      "Verify credentials",
      "Ensure proper authentication method",
    ],
    rfc: "RFC 7235",
  },
  {
    code: 403,
    name: "Forbidden",
    description:
      "The server understood the request but refuses to authorize it.",
    category: "client-error",
    commonUseCases: [
      "Insufficient permissions",
      "IP restrictions",
      "Content restrictions",
    ],
    troubleshooting: [
      "Check user permissions",
      "Verify IP whitelist",
      "Review access policies",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 404,
    name: "Not Found",
    description: "The requested resource could not be found on the server.",
    category: "client-error",
    commonUseCases: ["Missing pages", "Invalid URLs", "Deleted resources"],
    troubleshooting: [
      "Check URL spelling",
      "Verify resource exists",
      "Check server configuration",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 409,
    name: "Conflict",
    description:
      "The request could not be completed due to a conflict with the current state of the resource.",
    category: "client-error",
    commonUseCases: [
      "Version conflicts",
      "Duplicate resources",
      "State conflicts",
    ],
    troubleshooting: [
      "Check resource state",
      "Resolve conflicts",
      "Verify business logic",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 422,
    name: "Unprocessable Entity",
    description:
      "The server understands the content type and syntax but cannot process the contained instructions.",
    category: "client-error",
    commonUseCases: [
      "Validation errors",
      "Business rule violations",
      "Semantic errors",
    ],
    troubleshooting: [
      "Check input validation",
      "Review business rules",
      "Verify data format",
    ],
    rfc: "RFC 4918",
  },
  {
    code: 429,
    name: "Too Many Requests",
    description:
      "The user has sent too many requests in a given amount of time.",
    category: "client-error",
    commonUseCases: ["Rate limiting", "API throttling", "DDoS protection"],
    troubleshooting: [
      "Check rate limits",
      "Implement backoff strategy",
      "Review request frequency",
    ],
    rfc: "RFC 6585",
  },

  // 5xx Server Errors
  {
    code: 500,
    name: "Internal Server Error",
    description:
      "The server encountered an unexpected condition that prevented it from fulfilling the request.",
    category: "server-error",
    commonUseCases: [
      "Server crashes",
      "Unhandled exceptions",
      "Configuration errors",
    ],
    troubleshooting: [
      "Check server logs",
      "Verify server configuration",
      "Review error handling",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 502,
    name: "Bad Gateway",
    description:
      "The server received an invalid response from an upstream server.",
    category: "server-error",
    commonUseCases: [
      "Proxy errors",
      "Load balancer issues",
      "Upstream failures",
    ],
    troubleshooting: [
      "Check upstream servers",
      "Verify proxy configuration",
      "Review network connectivity",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 503,
    name: "Service Unavailable",
    description:
      "The server is temporarily unable to handle the request due to maintenance or overload.",
    category: "server-error",
    commonUseCases: [
      "Maintenance mode",
      "Server overload",
      "Temporary outages",
    ],
    troubleshooting: [
      "Check server status",
      "Verify maintenance schedule",
      "Review server resources",
    ],
    rfc: "RFC 7231",
  },
  {
    code: 504,
    name: "Gateway Timeout",
    description:
      "The server acting as a gateway did not receive a timely response from an upstream server.",
    category: "server-error",
    commonUseCases: ["Proxy timeouts", "Upstream delays", "Network issues"],
    troubleshooting: [
      "Check upstream response times",
      "Verify timeout settings",
      "Review network latency",
    ],
    rfc: "RFC 7231",
  },
]

export const CATEGORY_COLORS = {
  informational:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  redirection:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "client-error": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "server-error":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

export const CATEGORY_ICONS = {
  informational: Info,
  success: CheckCircle,
  redirection: Clock,
  "client-error": XCircle,
  "server-error": AlertTriangle,
}
