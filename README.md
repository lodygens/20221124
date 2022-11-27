# Frontend

## Env variables
In order to import wallet, we must create and fill frontend/src/environments/environment.ts


```
export const environment = {
  production: false,
  MNEMONIC: "bla bla",
  PRIVATE_KEY:"bla bla",
  INFURA_API_KEY:"bla bla",
  INFURA_API_SECRET:"blabla",
  ALCHEMY_API_KEY:"blabla",
  ETHERSCAN_API_KEY:"blabla"
}

```

## Run
```
cd frontend/myapp && yarn start
```


# Backend
## Env variables
In order to import wallet, we must create and fill backend/.env


```
MNEMONIC=""
PRIVATE_KEY=""
INFURA_API_KEY=""
INFURA_API_SECRET=""
ALCHEMY_API_KEY=""
ETHERSCAN_API_KEY=""


```

## Run
```
cd backend && yarn start:dev
```
