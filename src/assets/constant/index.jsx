// --staging ---
// export const endpoint = "https://staging.Hello Meghalaya.in/"

// --production-endpoint--
export const endpoint = "https://ottapi.hellomeghalaya.in/"


var auth_token_andriod_tv = "aGEvg8ofEN23Vxt3Cit9"
var auth_token_webos = "b2Bmc8QsGU5Pz4bxHQmP"
var auth_token_tizen = "vp8AypAZsvTsxsqs7NJz"
var secret_key_andriod_tv = "9273c3db06d8a44ef691"
var secret_key_webos = "4278c52bdfd419917375"
var secret_key_tizen = "cfeab93e83865c1789a8"
var auth_token = ""
export const nested_list_items = false

export const getAuthToken = () => {
  if (localStorage.getItem("platform") == "WebOS") {
    return auth_token = auth_token_andriod_tv
  } else {
    return auth_token = auth_token_andriod_tv
  }
}

export const getSecretKey = () => {
  if (localStorage.getItem("platform") == "WebOS") {
    return secret_key = secret_key_andriod_tv
  } else {
    return secret_key = secret_key_andriod_tv
  }
}

export const session_text = "session"






export const version = "1.0.0";
// export const  region=localStorage.getItem("region")
export const item_language = "eng"
export const secret_key = "";
export const session_Id = localStorage.getItem("session_id");