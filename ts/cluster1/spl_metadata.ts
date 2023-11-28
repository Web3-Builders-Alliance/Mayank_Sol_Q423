import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import {
  publicKey,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";


// Define our Mint address
const mint = new PublicKey("EvaqTeBKy5D4Bkaz2MTAPooNXwoPPUFRYeNJ6csNnof3");

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Create PDA for token metadata
const metadata_seeds = [
  Buffer.from("metadata"),
  token_metadata_program_id.toBuffer(),
  mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(
  metadata_seeds,
  token_metadata_program_id
);

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));


(async () => {
  try {
    // Start here
    let myTransaction = createMetadataAccountV3(umi, {
        metadata: publicKey(metadata_pda.toString()),
        mint: publicKey(mint.toString()),
        mintAuthority: signer,
        payer: signer,
        updateAuthority: keypair.publicKey,
        data: { // This is the metadata of the NFT that we are creating and we as in the Class 2 it possibly mutable
            name: "Mayank's NFT",
            symbol: "₹MSD",
            uri: "mayankonweb.pages.dev",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        },
        isMutable: true,
        collectionDetails: null,
    });

    let result = await myTransaction.sendAndConfirm(umi);

    console.log(`result.signature: ${result.signature}`); 
//     //Uint8Array(64) [
//     5, 234,  67, 143,  21, 131, 141, 107, 248, 106,  12,
//     255,  89, 174, 142,  65, 163,  76,  40, 208, 134, 145,
//     193, 113, 124, 200, 224, 115,  95, 202,  46, 247, 252,
//      63, 131,  32, 232, 149, 139, 207,  91,  75, 230,  42,
//     100, 103, 242,   4,  94, 181, 164, 126, 159, 137, 254,
//     121, 173,  77, 211, 175, 165, 168,  41,   4
//   ]
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
