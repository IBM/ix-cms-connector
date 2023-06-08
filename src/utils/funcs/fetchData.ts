/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import axios from "axios";

export async function fetchData(endpoint: string) {
  const res = await axios(endpoint);

  return await res.data;
}
