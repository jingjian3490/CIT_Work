- [ ] AWS S3 的使用
- [ ] Drupal 批处理使用
- [x] 创建移动 pre-comment 文件快捷指令 Indonesia 还没搞
- [ ] Drupal 分发版  distribution   

关于 config block ：https://chat.openai.com/c/62e8d331-069c-4f59-879b-3f6470822e99

The Dermatology Life Quality Index (DLQI) and the Children's Dermatology Life Quality Index (CDLQI) are 3rd Party Assessment Tools of Cardiff University and all intellectual property of the tools continues to vest in Cardiff University. Pfizer has only provided the tools as a matter of convenience and has no control on the outcome or the assessment and that the tools are not subject to Pfizer policies. Additional information on the tools can be accessed here.

Pfizer shall only be collecting data with regard to usage of the tools in aggregate (i.e. how many times the tool is used; the aggregate scores for such usage etc. Such data will be completely anonymised and will not be personally identifiable in any matter). Pfizer shall reserve the right to retain and use such data for any further analysis and/ any future publications and/or campaigns as may be deemed appropriate by Pfizer (in line with applicable laws and industry code/ guidelines).

# Pfadpsg SR
#### Update content
- Homepage
- GCMA code
- Pop-up
- New button for download file
- FAQ
### Assess my condition pop-up
- Create block
- Config block
### New page assess-my-condition-start for CDLQI
- Create node
- Config node (cookie logic)
### New page assess-my-condition-test for CDLQI
- Create & config question paragraph
- Create node
- Config node (question logic)
### New page assess-my-condition-result for CDLQI
- Create & config taxonomy for CDLQI
- Create node
- Config node  (score logic)
- Generate PDF for CDLQI (new twig template)
- Send result email (new email template)
