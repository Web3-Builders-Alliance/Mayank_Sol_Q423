import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("79q9RHDxGg8Z99WpSo3ZNyHxUqUDtSCQHkpvy5f86zpd");

// Recipient address
const to = new PublicKey("9Fznbs2uz7scVecfWEszy3TSqPXNMfuTbnexbgawJXHY");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
      undefined,
      commitment
    );
    console.log(`Your ata is: ${fromTokenAccount.address.toBase58()}`);
    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to,
      undefined,
      commitment
    );
    console.log(`Their ata is: ${toTokenAccount.address.toBase58()}`);

    // Transfer the new token to the "toTokenAccount" we just created

    const signature = await transfer(
      connection,
      keypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      keypair.publicKey,
      1000000
    );

    console.log(`Your transfer txid: ${signature}`);
    //Your transfer txid: f4VShxesbatE5Wqqna97jasUHTHn1pV1NN4aTZHCMChBKa6Gwfw9s7VP6xva9fQGTkE8zEmciSFUstkSfYfXWaE
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
