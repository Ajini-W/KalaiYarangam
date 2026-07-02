import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  globalSearch(@Query('q') q: string) {
    return this.searchService.globalSearch(q);
  }

  @Get('students')
  searchStudents(@Query('q') q: string) {
    return this.searchService.searchStudents(q);
  }

  @Get('leads')
  searchLeads(@Query('q') q: string) {
    return this.searchService.searchLeads(q);
  }

  @Get('batches')
  searchBatches(@Query('q') q: string) {
    return this.searchService.searchBatches(q);
  }

  @Get('trainers')
  searchTrainers(@Query('q') q: string) {
    return this.searchService.searchTrainers(q);
  }
}