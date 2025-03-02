import { AlloraAPIClient, ChainSlug } from '@alloralabs/allora-sdk'
import { tokenTopicMapping, TopicMapping } from './tokenTopicMapping'

const alloraClient = new AlloraAPIClient({
  chainSlug: ChainSlug.TESTNET 
})

async function fetchInference(topicId: number) {
  try {
    const inference = await alloraClient.getInferenceByTopicID(topicId)
    return inference
  } catch (error) {
    console.error('Error fetching inference for topic ' + topicId, error)
    return null
  }
}

async function getCurrentPrice(tokenName: string) {
  if (tokenName === 'binance') {
    tokenName = 'binance-usd'
  } else if (tokenName === 'sekoia') {
    tokenName = 'sekoia-by-virtuals'
  } else if (tokenName === 'virtual') {
    tokenName = 'virtual-protocol'
  }
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`, {
      headers: {
        accept: 'application/json'
      }
    })
    const data = await response.json()
    const price = data[tokenName]?.usd
    return price
  } catch (error) {
    console.error('Error fetching current price for token ' + tokenName, error)
    return null
  }
}

async function getTokenInferences(tokenName: string) {
  const mapping: TopicMapping[] | undefined = tokenTopicMapping[tokenName]
  if (!mapping) {
    throw new Error(`No mapping found for token "${tokenName}"`)
  }
  const results = []
  for (const topic of mapping) {
    const inference = await fetchInference(topic.topic_id)
    const currentPrice = await getCurrentPrice(tokenName)
    const normalized =
      inference && inference.inference_data
        ? inference.inference_data.network_inference_normalized
        : null
        if (normalized !== null) {
            results.push({
              token:tokenName,
              topic_id: topic.topic_id,
              topic_name: topic.topic_name,
              network_inference_normalized: normalized,
              current_price: currentPrice,
            })
          }
  }
  return results
}

async function main(tokenName: string) {
  try {
    const inferences = await getTokenInferences(tokenName)
    return inferences
  } catch (error) {
    console.error("Error:", error)
  }
}
// main('bitcoin')
export default main
