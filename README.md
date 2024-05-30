## Getting Started

First, install the dependencies:

```bash
npm i
# or
npm install
```

then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Update input behaviour

when the user clicks on the input save, cancel button should appear and if after typying or removing any charecter from the input user decides to click on cancel button then the last data that is available in the database should get reverted and if the user clicks on save the field will get updated without page reload and the input value should be the latest value.

if the user by any chance refreshs the page then the latest changes should appear insted of last modified data

[Click here to view the animation in full resolution](https://github.com/Mohit-au50/staybook-firestore-task/blob/main/updateField.gif)

![Animation](https://github.com/Mohit-au50/staybook-firestore-task/blob/main/updateField.gif)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
