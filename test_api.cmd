@echo off
setlocal enabledelayedexpansion

set URL1=https://gemrealty-backend-lfl2ohixga-pd.a.run.app/api/login
echo %URL1%
curl -X POST ^"%URL1%^" ^
  -H ^"accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7^" ^
  -H ^"accept-language: en,zh-CN;q=0.9,zh;q=0.8^" ^
  -H ^"cache-control: no-cache^" ^
  -H ^"pragma: no-cache^" ^
  -H ^"priority: u=0, i^" ^
  -H ^"sec-ch-ua: ^\^"Chromium^\^";v=^\^"146^\^", ^\^"Not-A.Brand^\^";v=^\^"24^\^", ^\^"Google Chrome^\^";v=^\^"146^\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" ^
  -H ^"sec-ch-ua-platform: ^\^"Windows^\^"^" ^
  -H ^"sec-fetch-dest: document^" ^
  -H ^"sec-fetch-mode: navigate^" ^
  -H ^"sec-fetch-site: none^" ^
  -H ^"sec-fetch-user: ?1^" ^
  -H ^"upgrade-insecure-requests: 1^" ^
  -H ^"user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36^" ^
  -H ^"Content-Type: application/json^" ^
  -d ^"{\"username\": \"test\", \"password\": \"test1234\"}^"

echo .
set URL2=https://gemrealty-frontend-1017140935292.northamerica-northeast2.run.app/api/login
echo %URL2%
curl -X POST ^"%URL2%^" ^
  -H ^"accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7^" ^
  -H ^"accept-language: en,zh-CN;q=0.9,zh;q=0.8^" ^
  -H ^"cache-control: no-cache^" ^
  -H ^"pragma: no-cache^" ^
  -H ^"priority: u=0, i^" ^
  -H ^"sec-ch-ua: ^\^"Chromium^\^";v=^\^"146^\^", ^\^"Not-A.Brand^\^";v=^\^"24^\^", ^\^"Google Chrome^\^";v=^\^"146^\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" ^
  -H ^"sec-ch-ua-platform: ^\^"Windows^\^"^" ^
  -H ^"sec-fetch-dest: document^" ^
  -H ^"sec-fetch-mode: navigate^" ^
  -H ^"sec-fetch-site: none^" ^
  -H ^"sec-fetch-user: ?1^" ^
  -H ^"upgrade-insecure-requests: 1^" ^
  -H ^"user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36^" ^
  -H ^"Content-Type: application/json^" ^
  -d ^"{\"username\": \"test\", \"password\": \"test1234\"}^"

endlocal