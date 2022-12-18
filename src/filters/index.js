// import moment  from "moment";

import format from 'date-fns/format'
import Vue from 'vue'

Vue.filter('date-format', function (value, formatStr='YYYY-MM-DD HH:mm:ss') {
    // return moment(value).format(formatStr)
    return format(value, formatStr)
  })