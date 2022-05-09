<template>
  <div class="hello">
    <el-container style="height: 100%; border: 1px solid #eee">

      <el-aside :width="sideWidth+'px'" style="background-color: rgb(238, 241, 246)">
        <!--collapse:侧边栏折叠效果-->
        <el-menu :default-openeds="['1','2']" style="min-height: 100%; overflow-x: hidden"
                 :collapse="isHiddenAside" background-color="rgb(48,65,86)" text-color="#fff">
          <!--加个标题-->
          <div style="height: 60px;line-height: 60px;text-align: center">
            <img src="../assets/logo.png" style="width: 15px; height: 15px">
            <!--<i class="el-icon-setting"></i>-->
            <b style="color: aliceblue" v-show="!isHiddenAside"> 后台管理系统</b>
          </div>
          <el-submenu :index="menu.id" v-for="menu in menuList" :key="menu.id">
            <template slot="title"><i :class="menu.iconC"></i>
              <span slot="title">{{menu.title}}</span>
            </template>
            <el-menu-item-group>
              <!--<template slot="title">分组一</template>-->
              <el-menu-item :index="func.funcId" v-for="func in menu.functionList" :key="func.funcId" @click="menuChange(func.tableName)">{{func.funcName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="font-size: 12px; display: flex" class="el-header">
          <div style="flex: 1; font-size: 18px;">
            <span :class="isHiddenAside?'el-icon-s-unfold':'el-icon-s-fold'"
                  style="cursor: pointer" @click="asideHiddenHandle"></span>
          </div>
          <el-dropdown style="width: 70px; cursor: pointer">
            <div>
              <span>王小虎</span>
              <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
            </div>
            <!--<i class="el-icon-setting" style="margin-right: 15px"></i>-->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </el-header>

        <el-main style="margin: 0px; padding-top: 5px;">
          <div style="padding: 5px 0; margin: 2px 0">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>活动管理</el-breadcrumb-item>
              <el-breadcrumb-item>活动列表</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!--搜索框-->
          <div style="padding: 1px 0;margin: 0px" v-show="isEditInput">
            <el-input v-for="(field,index) in FieldsList" v-model="inputArr[index]"  :style="'width: '+(parseInt(field.width)+50)+'px'" :placeholder="field.label" :key="field.prop"
                      type="textarea" :rows="defaultRow" :autosize="autoSize" :auto-complete="'on'">
              {{inputArr[index]}}
            </el-input>
            <!--<el-input  style="width: 120px" placeholder="请输入日期" suffix-icon="el-icon-search"></el-input>-->
            <!--<el-input  style="width: 120px" placeholder="请输入姓名" suffix-icon="el-icon-search" class="ml-5"></el-input>-->
            <!--<el-input  style="width: 120px" placeholder="请输入地址" suffix-icon="el-icon-search" class="ml-5"></el-input>-->

          </div>
          <!--功能操作-->
          <div style="margin: 5px">
            <el-button type="primary" class="ml-5" @click="searchButHandle">搜索 <i class="el-icon-search"></i></el-button>
            <el-button type="primary" @click="newButHandle">新增 <i class="el-icon-circle-plus-outline"></i> </el-button>
            <!--<el-button type="danger">删除 <i class="el-icon-remove-outline"></i> </el-button>-->

            <el-button type="primary">导入 <i class="el-icon-download"></i> </el-button>
            <el-button type="primary">导出 <i class="el-icon-upload2"></i> </el-button>
            <el-button type="danger" style="margin-left: 10px" @click="releaseButHandle">取消 <i class="el-icon-s-release"></i> </el-button>
            <el-button type="primary" @click="saveOrAddHandle" v-show="isSaveButShow||isAddButShow">{{isSaveButShow?'保存编辑':'确认新增'}} <i class="el-icon-upload2"></i> </el-button>
            <el-button type="primary" @click="axiosTest">测试接口 <i class="el-icon-download"></i> </el-button>

          </div>
          <!--border:表格框,-->
          <el-table :data="tableData" border stripe>
            <el-table-column v-for="item in FieldsList" :prop="item.prop" :label="item.label" :width="item.width" :key="item.prop">
            </el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    @click="rowHandleEdit(scope.$index, scope.row)">
                  编辑 <i class="el-icon-edit"></i>
                </el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="rowHandleDelete(scope.$index, scope.row)">
                  删除 <i class="el-icon-remove-outline"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div style="padding: 10px 0">
            <!--索引栏-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import * as Qs from "querystring";
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      isHiddenAside:false,
      sideWidth:200,
      tableData: [],
      currentPage:1,
      pageSize:5,
      // 数据条数
      total:0,
      // 字段列表
      FieldsList:[],
      menuList:[],
      tableName:"Article",
      input_0:"",
      input_1:"",
      input_2:"",
      input_3:"",
      input_4:"",
      input_5:"",
      input_6:"",
      input_7:"",
      inputArr:[],
      // 搜索框行数
      defaultRow:2,
      autoSize:{
        minRows: 2,
        maxRows: 6
      },
      // 是否显示搜索输入框
      isEditInput:false,
      // 是否显示保存编辑按钮
      isSaveButShow:false,
      // 是否显示确认新增按钮
      isAddButShow:false,
    }
  },
  beforeCreate() {

  },
  created() {
    this.inputArr=[this.input_0,this.input_1,this.input_2,this.input_3,this.input_4,this.input_5,this.input_6,this.input_7];

    const dataMenu={
      id:"1",
      title:"数据管理",
      iconC:"el-icon-s-data",
      functionList:[
        {
          funcId:"1-1",
          funcName:"文章管理",
          tableName:"Article"
        },
        {
          funcId:"1-2",
          funcName:"课程管理",
          tableName:"Course"
        },
        {
          funcId:"1-3",
          funcName:"评论管理",
          tableName:"TComment"
        },
      ]
    };
    const sysMenu={
      id:"2",
      title:"系统信息管理",
      iconC:"el-icon-s-platform",
      functionList:[
        {
          funcId:"2-1",
          funcName:"图标管理",
          tableName:"SysDict"
        },
        {
          funcId:"2-2",
          funcName:"文件管理",
          tableName:"SysFile"
        },
        {
          funcId:"2-3",
          funcName:"主页管理",
          tableName:"SysMenu"
        },
        {
          funcId:"2-4",
          funcName:"身份管理",
          tableName:"SysRole"
        },
        {
          funcId:"2-5",
          funcName:"账户管理",
          tableName:"SysFile"
        },
      ]
    };
    this.menuList=[dataMenu,sysMenu];
    // console.log("menuList: ",this.menuList);
    const dataUrl="/back/"+this.tableName+"/page?pageNum=1&pageSize=5";
    // 获取分页数据
    axios(dataUrl)
        .then(res => {//第二个then返回的是字符串类型
          // console.log("res: ",res.data)
          this.total = res.data.total;
          this.tableData = res.data.data;
          // console.log(this.tableData)
    });
    const fieldUrl="/back/field?className="+this.tableName;
    // 获取SysFile类字段
    axios(fieldUrl)
        .then(res => {//第二个then返回的是字符串类型
          // console.log("res: ",res.data)
          this.FieldsList = res.data;
          // console.log(this.FieldsList)
        });

  },
  methods:{
    dataInitialize(){
      this.isEditInput=false;
      this.isSaveButShow=false;
      this.isAddButShow=false;
      for (let i = 0; i < this.inputArr.length; i++) {
        this.inputArr[i]="";
      }
    },
    //侧边栏隐藏
    asideHiddenHandle(){
      // console.log("隐藏")
      this.isHiddenAside=!this.isHiddenAside
      if (this.isHiddenAside){
        this.sideWidth=64
      }else{
        this.sideWidth=200
      }
    },
    //pageSize 改变时会触发,每页条数
    handleSizeChange(size){
      this.pageSize=size
      const url="/back/"+this.tableName+"/page?pageNum="+this.currentPage+"&pageSize="+this.pageSize
      axios(url)
          .then(res => {//第二个then返回的是字符串类型
            // console.log("res: ",res.data)
            this.total = res.data.total
            this.tableData = res.data.data
            // console.log(this.tableData)
          })
      // console.log(size)
    },
    //currentPage 改变时会触发,当前页
    handleCurrentChange(page){
      this.currentPage=page
      const url="/back/"+this.tableName+"/page?pageNum="+this.currentPage+"&pageSize="+this.pageSize
      axios(url)
          .then(res => {//第二个then返回的是字符串类型
            // console.log("res: ",res.data)
            this.total = res.data.total
            this.tableData = res.data.data
            // console.log(this.tableData)
          })
      // console.log(page)
    },
    //表格行 编辑事件
    rowHandleEdit(index, row){
      this.dataInitialize();
      this.isSaveButShow=true;
      this.isEditInput=true;
      var rIndex=0;
      for (const rowKey in row) {
        // console.log("rowKey",rowKey)
        if(typeof(row[rowKey])!="function"){
          // console.log("row[rowKey]: ",row[rowKey])
          var searchTimes=0;
          for (let i = rIndex; i < this.FieldsList.length; i++) {
            // console.log("prop: ",this.FieldsList[i].prop)
            // row中的rowKey字段和FieldsList[i].prop的属性相等时,说明是同一个字段
            if (rowKey==this.FieldsList[i].prop){
              // console.log("找到了...");
              // 将row[rowKey]中的值,赋给输入框
              this.inputArr[i]=row[rowKey];
              break;
            }
            // 防止FieldsList和row字段位置不一致,就是最不保险得方法,确保全部循环一遍
            if (i >= this.FieldsList.length-1){
              if (searchTimes<this.FieldsList.length){
                i=-1;
              }
            }
            // 当查找次数超过FieldsList字段得总数时,退出,没找到时rIndex不算
            if (searchTimes>=this.FieldsList.length){
              rIndex--;
              break;
            }

            searchTimes++;
          }

        }
      if (rIndex <  this.FieldsList.length-1)
        rIndex=rIndex+1;
      }
      // console.log("FieldsList: ",this.FieldsList);
      // console.log("tableData: ",this.tableData);
      // console.log("编辑:index=",index,", row=", row);
    },
    //表格行 删除事件
    rowHandleDelete(index, row){
      console.log("删除:index=",index,", row=", row);
    },
    menuChange(tableName){
      this.dataInitialize();
      // console.log("数据库名称:",tableName)
      // 侧边栏选项改变了才发请求
      if (tableName!==this.tableName)
      {
        //  首先获取表头名称,即数据库字段
        const fieldUrl="/back/field?className="+tableName;
        // console.log(fieldUrl);
        // 获取SysFile类字段
        axios(fieldUrl)
            .then(res => {//第二个then返回的是字符串类型
              // console.log("res: ",res.data);
              this.FieldsList = res.data;
              // console.log(this.FieldsList);
            });
        const dataUrl="/back/"+tableName+"/page?pageNum="+this.currentPage+"&pageSize="+this.pageSize;
        // 获取分页数据
        axios(dataUrl)
            .then(res => {//第二个then返回的是字符串类型
              // console.log("res: ",res.data)
              this.total = res.data.total;
              this.tableData = res.data.data;
              // console.log(this.tableData)
            });
        this.tableName=tableName;
      }

    },
    searchButHandle(){
      this.dataInitialize();
      this.isEditInput=true;
    },
    newButHandle(){
      this.dataInitialize();
      this.isAddButShow=true;
      this.isEditInput=true;
    },
    releaseButHandle(){
      this.dataInitialize();
    },
    saveOrAddHandle(){
      console.log(this.FieldsList)
      let obj={
      };
      let nullTimes=1;
      for (let i = 0; i < this.FieldsList.length; i++) {
        if (this.inputArr[i]=="")
          nullTimes++;
        this.$set(obj,this.FieldsList[i].prop,this.inputArr[i]);
      }
      console.log(obj);
      if (nullTimes>=this.FieldsList.length){
        alert("数据为空");
      }else {
        let fieldUrl = "/back/" + this.tableName;
        if (this.isAddButShow) {
          fieldUrl += "/save";
        } else if (this.isEditInput) {
          fieldUrl += "/update";
        }
        console.log(fieldUrl);
        axios({
          method: "post",
          url: fieldUrl,
          data: obj,

          transformRequest: [function (data) {
            return Qs.stringify(data) //使用Qs将请求参数序列化
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded' //必须设置传输方式
          }
        }).then((res) => {
          // console.log(res.data)
          if (res.data.state=="success"){
            // 操作成功后,更新数据
            this.handleCurrentChange(this.currentPage);
            alert("成功");
          }else {
            alert("失败");
          }
          //逻辑代码
        })

      }
    },

    axiosTest() {
      console.log("测试中...");
      let obj={
      };
      let nullTimes=1;
      for (let i = 0; i < this.FieldsList.length; i++) {
        if (this.FieldsList[i].prop == "id") {
          nullTimes++;
          continue;
        }
        if (this.inputArr[i]=="")
          nullTimes++;
        this.$set(obj,this.FieldsList[i].prop,this.inputArr[i]);
      }
      console.log(obj);
      if (nullTimes>=this.FieldsList.length){
        alert("数据为空");
      }else{
        const fieldUrl = "/back/"+this.tableName+"/save";
        axios({
          method: "post",
          url: fieldUrl,
          data: obj,
          transformRequest: [function (data) {
            return Qs.stringify(data) //使用Qs将请求参数序列化
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded' //必须设置传输方式
          }
        }).then((res) => {
          console.log(res.data)
          if (res.data.state=="success"){
            alert("新增成功");
          }else {
            alert("新增失败");
          }
          //逻辑代码
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
