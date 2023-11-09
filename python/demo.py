import requests
import time
import os

from web3 import Web3
from web3.middleware import geth_poa_middleware
from eth_account import Account
from dotenv import load_dotenv
load_dotenv()

url = 'https://binance.llamarpc.com'
txboost_url = 'https://relay-bsc.txboost.io'

def attach_flashbots(
    w3,
    signature_account,
    endpoint_uri,
):
    """
    Injects the flashbots module and middleware to w3.
    """
    from web3._utils.module import attach_modules
    from flashbots import Flashbots
    from flashbots import construct_flashbots_middleware
    from flashbots import FlashbotProvider

    s = requests.Session()
    s.headers.update({'authorization': os.getenv('AUTHORIZATION')})
    flashbots_provider = FlashbotProvider(signature_account, endpoint_uri, session=s)

    flash_middleware = construct_flashbots_middleware(flashbots_provider)
    w3.middleware_onion.add(flash_middleware)

    # attach modules to add the new namespace commands
    attach_modules(w3, {"flashbots": (Flashbots,)})

def main():
    # Connect to the Ethereum network
    w3 = Web3(Web3.HTTPProvider(url))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)

    # Import an account using a private key
    private_key = os.getenv('PRIV_KEY')
    account = Account.from_key(private_key)
    nonce = w3.eth.get_transaction_count(account.address)

    attach_flashbots(w3, account, txboost_url)

    # Create a transaction
    tx = {
        'to': account.address,
        'value': 0,
        'gas': 21000,
        'gasPrice': w3.toWei('3', 'gwei'),
        'nonce': nonce,
        'chainId': w3.eth.chainId
    }

    # Sign the transaction
    signed_tx = account.sign_transaction(tx)
    bundle = [
        {"signed_transaction": signed_tx.rawTransaction},
    ]

    # Simulate the bundle
    target = w3.eth.blockNumber + 1
    simulated = w3.flashbots.simulate(bundle, target)
    print("bundle simulated:")
    print(simulated)

    # Send the bundle
    rsp = w3.flashbots.send_bundle(bundle, target)
    print("bundle sent")
    rsp.wait()


if __name__ == '__main__':
    main()
