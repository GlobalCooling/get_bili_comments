const https=require('https');  
const fs=require('fs');

var url1='https://api.bilibili.com/x/v2/reply?&jsonp=jsonp&pn=';
var url2='&type=11&oid=动态的id号码&sort=2&_=1562316459358'; //需要根据情况修改

var page_num=0;//评论总页数
fs.writeFileSync('name.csv', '\ufeff'+'用户ID,评论内容\n');//写BOM头\ufeff，不然csv文件中文乱码

function get_data(num){
    //发起get请求
    https.get(url1+num+url2,function(req,res){  
        var bili_data='';//接受数据的变量
        //监听data事件，累加数据到bili_data变量中
        req.on('data',function(data){
            //console.log(data);//buffer
            bili_data+=data;  		
        });  
        //end事件
        req.on('end',function(){  
            //console.log(bili_data);		
            bili_data=JSON.parse(bili_data);//完整的数据转为json对象
            //console.log(bili_data.data.replies);//提取回复的json数组[{},{},{}...]
            var reply=bili_data.data.replies;
            var reply_data='';//评论区用户名和评论信息

            for (var index in reply) {//遍历json数组
                reply_data+=reply[index].member.uname+','+reply[index].content.message+'\n';
                //console.log(reply[index].member.uname);
            }
            //console.log(reply_data);
            //评论区用户id和评论信息写入文件
            var fd=fs.openSync('name.csv','a+');
            fs.writeSync(fd, reply_data);
            console.log("第%d页评论写入",num);
            fs.closeSync(fd);
            console.log("第%d页写入完成",num);

        });//end res.on  
    }); //end https.get

}//end function


for (let i = 1; i <= page_num; i++) {
    get_data(i);
}
