/**
 * 得到首页内容的数据
 * @param string $type
 * @return string
 */
exports.get_index_linkids = function get_index_linkids(type){
//    global $DB;
//
//    $temp = $DB->query_first("SELECT *
//    FROM " . TABLE_PREFIX . "iphone_index
//    WHERE type = '" . addslashes($type) . "'
//    LIMIT 1");
//    $linkids = "";
//    foreach(explode(",", $temp["linkids"]) as $linkid){
//        if(intval($linkid)){
//            $linkids .= intval($linkid) . ",";
//        }
//    }
//    $linkids = trim($linkids, ",");
//
//    return $linkids;
    return ['1','2','3'];
}

exports.get_link_array = function get_link_array(custom_condition, order_by, thumb_dir, more_info, pagenum, perpage){
    return new Object();
}