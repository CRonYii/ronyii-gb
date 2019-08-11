const path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                        },
                    },
                ],
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        port: 3000,
        hot: true
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};