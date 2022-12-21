## Product service

### Deployment

```
$ npm deploy
```
### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl https://xxxxxxx.execute-api.eu-central-1.amazonaws.com/
```

You can also check the Swagger documentation via the following address:

```bash
curl https://xxxxxxx.execute-api.eu-central-1.amazonaws.com/swagger
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function hello
```

Alternatively, it is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

To learn more about the capabilities of `serverless-offline`, please refer to its [GitHub repository](https://github.com/dherault/serverless-offline).
