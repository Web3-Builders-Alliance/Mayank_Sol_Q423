import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("79q9RHDxGg8Z99WpSo3ZNyHxUqUDtSCQHkpvy5f86zpd"); // This is the mint address of the token we want to mint and we got this through spl_init.ts

(async () => {
    try {
        // Create an ATA
        // const ata = ?
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            new PublicKey('9Fznbs2uz7scVecfWEszy3TSqPXNMfuTbnexbgawJXHY'), 
            true,
            commitment
          );        

        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        // const mintTx = ???
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            new PublicKey(ata.address),
            new PublicKey('9Fznbs2uz7scVecfWEszy3TSqPXNMfuTbnexbgawJXHY'), 
            1_000_000n * token_decimals, 
          );
          console.log(
            `Minted ${1_000_000n * token_decimals / token_decimals} tokens to ${ata.address.toBase58()}`
          );
        console.log(`Your mint txid: ${mintTx}`);

    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()


// Output:
// Your ata is: DSJZu7JsRa7yyrobicAebDo8xb3T5N2KiZwP54zxPqNp
// Minted 1000000 tokens to DSJZu7JsRa7yyrobicAebDo8xb3T5N2KiZwP54zxPqNp
// Your mint txid: 4bzRV3cfWKWUdSBmJAJDxDkYPFKe56TvRfykxKx8s5bAAggWP8VjYzgzBqbSeAPzY9VdBWM6a2VdSN83RrPjmtQk