<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <HelloWorld msg="欢迎来到乐乎问答"/>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '../components/HelloWorld.vue'

    export default {
        name: 'QuestionList',
        components: {
            HelloWorld
        }
    }
</script>
