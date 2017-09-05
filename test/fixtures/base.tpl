<!doctype HTML>
<html>
    <head>
        <meta charset="utf-8">
        <title>Hello World</title>
    </head>
    <body>
        <set hellk="1" bar="this is a string" value-bas="value | upper"/>

        <!-- // For 循环 -->
        <div kyber-for="(item, index) in list">
            <p>{{index}}. {{ item }} - {{ hellk }}</p>
        </div>

        <div class="main hd ft-13" kyber-class="['value', 'ddcd']">Hello</div>

        <!-- // 简单变量，过滤器，template 标签 -->
        <p style="font-size: 14px; color: #FFF;" kyber-style="{fontSize: '17px'}">{{ value }} {{ valueBas }}</p>
        <template>{{ bar  | upper }}</template>

        <!-- comment -->
        <!-- // plain 文字不解析结构，只解析表达式 -->
        <textarea name="name" rows="8" cols="80">
            <!-- Hello -->
            <div kyber-for="item in list">
                <!-- // 异步调用 -->
                {{ call() }}
                <p>Test</p>
            </div>
        </textarea>
        <!-- // literal 不解析表达式 -->
        <script type="text/template" kyber-literal kyber-if="list.length">
            <div kyber-for="item, index in list" xxx='dd'>
                <p>{{index}}. {{ item }}</p>
            </div>
        </script>
    </body>
</html>
