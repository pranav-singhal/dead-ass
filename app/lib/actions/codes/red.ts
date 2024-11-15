import {
    createPublicClient,
    createWalletClient,
    http,
    parseEther,
    type Address
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet, sepolia } from 'viem/chains';

const emergencyContacts = [
    'prnv.eth',
    'hellokp.eth'
] as const;

const EMERGENCY_MESSAGE = `EMERGENCY ALERT: The owner of this wallet has triggered a red alert. 
Emergency funds have been transferred to your wallet. Please attempt to make contact immediately.`;

export default async function red() {
    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error('Wallet private key not found in environment variables');
    }

    const isEmergencyTransferEnabled = process.env.ENABLE_EMERGENCY_TRANSFERS === 'true';

    // Create wallet client
    const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
    const client = createWalletClient({
        account,
        chain: sepolia,
        transport: http('https://eth-sepolia.public.blastapi.io')
    });

    try {
        // Resolve ENS names to addresses using Sepolia RPC
        const publicClient = createPublicClient({
            chain: mainnet,
            transport: http()
        });

        // Get all addresses from ENS names
        const resolvePromises = emergencyContacts.map(ens =>
            publicClient.getEnsAddress({ name: ens })
        );
        const addresses = await Promise.all(resolvePromises);

        console.log('Addresses resolved:', addresses);

        // Filter out any null addresses
        const validAddresses = addresses.filter((addr: Address | null): addr is Address => addr !== null);

        let amountPerAddress: bigint;
        if (isEmergencyTransferEnabled) {
            // Get current balance and calculate amount per address
            const balance = await client.getBalance({ address: account.address });
            const gasReserve = parseEther('0.01');
            const availableBalance = balance - gasReserve;
            amountPerAddress = availableBalance / BigInt(validAddresses.length);
        } else {
            // Test amount of 0.01 ETH per address
            amountPerAddress = parseEther('0.01');
        }

        // Send transactions
        console.log('Sending transactions...', validAddresses);
        const transactions = validAddresses.map((to: Address) =>
            client.sendTransaction({
                to,
                value: amountPerAddress,
                chain: sepolia
            })
        );

        // Wait for all transactions to complete
        await Promise.all([...transactions]);

        // Get transaction receipts
        const receipts = await Promise.all(transactions.map(tx => client.waitForTransactionReceipt({ hash: tx.hash })));

        console.log('Transactions promises resolved:', receipts);

        const message = isEmergencyTransferEnabled
            ? 'User is in immediate danger. All available funds distributed to trusted contacts.'
            : 'User is in immediate danger. Test amount (0.01 ETH) distributed to trusted contacts.';

        return {
            code: 'red',
            message
        };
    } catch (error) {
        console.error('Failed to execute emergency actions:', error);
        throw error;
    }
}