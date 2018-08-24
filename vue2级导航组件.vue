<template>
    <div>
        <ul>
            <li class="li1" v-for="item of list">
                <span>{{item.name}}</span>
                <ul>
                    <li v-for="navin of item.navlist">
                        <a :href="navin.links">{{navin.text}}</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {
            list:""
        }
    },
    mounted() {
        var that = this;
        this.$http("https://www.easy-mock.com/mock/5ae2b3c4ab5bad29ce810a51/example/nav").then(function (data) {
            that.list = data.data.list
        }).catch((err)=>{
            console.log(err)
        })
    }
}
</script>

<style>
    .li1{
        float: left;
        padding: 10px;
        border: 1px solid red;
        margin: 0 5px;
    }
    .li1 li{
        display: none;
    }
    .li1:hover li{
        display: block;
    }
</style>
