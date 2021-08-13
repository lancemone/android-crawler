module.exports = {

    parser: '@typescript-eslint/parser', //定义ESLint的解析器
    extends: [
        'prettier/@typescript-eslint',
        'plugin:@typescript-eslint/recommended'],//定义文件继承的子规范
    plugins: ['@typescript-eslint'],//定义了该eslint文件所依赖的插件
    env: {                          //指定代码的运行环境
        browser: true,
        node: true,
    },
    rules: {
        // 禁止使用 var
        'no-var': "error",
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': [
            "error",
            "interface"
        ]
    }
}