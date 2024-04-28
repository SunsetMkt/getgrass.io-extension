import axios from "axios";

export const getIpAddress = async (): Promise<string> => {
  try {
    const res = await axios.get("https://api.bigdatacloud.net/data/client-ip");

    if (res.data.isBehindProxy) {
      return res.data.proxyIp;
    }

    return res.data.ipString;
  } catch (err) {
    console.error("[IP ERROR]", err);
    return "";
  }
};
