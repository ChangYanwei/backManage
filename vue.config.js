/*
* vue会将此文件中的配置和公共配置做一个合并。
* 在此文件中配置路径的别名
* */
module.exports = {
  configureWebpack: {
    resolve: {
      alias:{
        //vue已经内置了一个路径别名：@，对应src文件夹
        "assets":"@/assets",
        "common":"@/common",
        "components":"@/components",
        "network":"@/network",
        "views":"@/views"
      }
    }
  }
}
