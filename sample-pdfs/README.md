# Sample PDFs for Testing

Download these publicly available PDFs to test the `pdf-mcp-server` extraction. Place them in this directory.

1. **TQL Carrier Rate Confirmation Example** (Full truckload van from TN to Mexico, $3,150 rate, includes stops and terms):
   - URL: https://www.jcglobalgroup.us/wp-content/uploads/2023/11/TQL-Carrier-Rate-Confirmation-Example.pdf
   - Download and save as `tql-rate-confirmation.pdf`

2. **Generic Rate Confirmation Template** (Shipper-carrier agreement with rate details, pickup/del windows):
   - URL: https://www.ww2.jacksonms.gov/sites/default/files/2020-01/Generic%20Rate%20Confirmation%20Template.pdf
   - Download and save as `generic-rate-confirmation.pdf`

3. **Motor Carrier Load Tender Specs** (Detailed XML/PDF hybrid example with equipment, commodities, and tender instructions):
   - URL: https://www.chrobinson.com/en-us/resources/motor-carrier-load-tender-specs.pdf
   - Download and save as `motor-carrier-load-tender.pdf`

4. **EDI 204 Load Tender Example** (Standard format with scheduling, rates, and shipping instructions):
   - URL: https://kroger.onenetwork.com/edi/204_Load_Tender_Example.pdf
   - Download and save as `edi-204-load-tender.pdf`

After downloading, test with:
```bash
# Example: Parse one PDF
cd pdf-mcp-server
npm start  # Then call the tool with path to sample-pdfs/tql-rate-confirmation.pdf
```

These mimic real spot market offers from brokers like TQL or C.H. Robinson.